using KasiConnectBackEnd.Data;
using KasiConnectBackEnd.DTOs;
using KasiConnectBackEnd.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KasiConnectBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly JwtService _jwtService;
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly PasswordService _passwordService;

        public AuthController(
            AuthService authService,
            JwtService jwtService,
            AppDbContext context,
            EmailService emailService,
            PasswordService passwordService)
        {
            _authService = authService;
            _jwtService = jwtService;
            _context = context;
            _emailService = emailService;
            _passwordService = passwordService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Invalid request" });
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (existingUser != null)
                    return BadRequest(new { message = "Email already exists" });

                var result = await _authService.Register(dto);

                return Ok(new
                {
                    message = "User registered successfully",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Registration failed",
                    error = ex.Message
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Invalid request" });

                var token = await _authService.Login(dto, _jwtService);

                if (token == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                return Ok(new
                {
                    message = "Login successful",
                    token
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Login failed",
                    error = ex.Message
                });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.Email))
                    return BadRequest(new { message = "Email is required" });

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                user.ResetToken = Guid.NewGuid().ToString();
                user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

                await _context.SaveChangesAsync();

                var resetLink =
                    $"http://localhost:4200/reset-password?email={user.Email}&token={user.ResetToken}";

                await _emailService.SendEmail(
                    user.Email,
                    "Reset Your Password",
                    $@"
                        <h2>Password Reset</h2>
                        <p>Click below to reset your password:</p>
                        <a href='{resetLink}'>Reset Password</a>
                        <p>Expires in 15 minutes</p>
                    "
                );

                return Ok(new
                {
                    message = "Reset email sent successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to send reset email",
                    error = ex.Message
                });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Invalid request" });

                var user = await _context.Users.FirstOrDefaultAsync(u =>
                    u.Email == dto.Email &&
                    u.ResetToken == dto.Token &&
                    u.ResetTokenExpiry > DateTime.UtcNow
                );

                if (user == null)
                    return BadRequest(new { message = "Invalid or expired token" });

                user.PasswordHash = _passwordService.HashPassword(dto.NewPassword);
                user.ResetToken = null;
                user.ResetTokenExpiry = null;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Password reset successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Password reset failed",
                    error = ex.Message
                });
            }
        }
    }
}