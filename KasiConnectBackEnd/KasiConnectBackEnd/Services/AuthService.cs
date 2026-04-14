using KasiConnectBackEnd.Data;
using KasiConnectBackEnd.DTOs;
using KasiConnectBackEnd.Models;
using System.Text;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

namespace KasiConnectBackEnd.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RegisterResponseDto> Register(RegisterDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = dto.Role
            };

            if (dto.Role == "Provider")
            {
                user.ProviderProfile = new ProviderProfile
                {
                    Description = "",
                    Location = "",
                    HourlyRate = 0,
                    IsActive = true
                };
            }
            else
            {
                user.CustomerProfile = new CustomerProfile
                {
                    Phone = null
                };
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new RegisterResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<string?> Login(LoginDto dto, JwtService jwtService)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return null;

            if (user.PasswordHash != HashPassword(dto.Password))
                return null;

            return jwtService.GenerateToken(user);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
