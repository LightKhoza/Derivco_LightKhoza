using KasiConnectBackEnd.Data;
using KasiConnectBackEnd.DTOs;
using KasiConnectBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KasiConnectBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvidersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProvidersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProviders()
        {
            var providers = await _context.ProviderProfiles
                .Include(p => p.User)
                .Select(p => new ProviderDto
                {
                    Id = p.Id,
                    Description = p.Description,
                    Location = p.Location,
                    HourlyRate = p.HourlyRate,

                    Name = p.User.Name,
                    Email = p.User.Email
                })
                .ToListAsync();

            return Ok(providers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProvider(int id)
        {
            var provider = await _context.Providers
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (provider == null) return NotFound();

            return Ok(provider);
        }

        [Authorize(Roles = "Provider")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateProviderProfile(Provider provider)
        {
            _context.Providers.Add(provider);
            await _context.SaveChangesAsync();
            return Ok(provider);
        }

        [HttpGet("services")]
        public async Task<IActionResult> GetServices()
        {
            return Ok(await _context.Services.ToListAsync());
        }

        [Authorize(Roles = "Provider")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized("Invalid token");

            var profile = await _context.ProviderProfiles
                .Include(p => p.ProviderServices)
                .ThenInclude(ps => ps.Service)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(profile);
        }

        [Authorize(Roles = "Provider")]
        [HttpPost("profile")]
        public async Task<IActionResult> CreateOrUpdateProfile([FromBody] CreateProviderProfileDto dto)
        {
            try
            {
                var userIdClaim =
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                    User.FindFirst("id")?.Value;

                if (!int.TryParse(userIdClaim, out int userId))
                    return Unauthorized(new { message = "Invalid token" });

                var profile = await _context.ProviderProfiles
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (profile == null)
                {
                    profile = new ProviderProfile
                    {
                        UserId = userId,
                        Description = dto.Description,
                        Location = dto.Location,
                        HourlyRate = dto.HourlyRate
                    };

                    _context.ProviderProfiles.Add(profile);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    profile.Description = dto.Description;
                    profile.Location = dto.Location;
                    profile.HourlyRate = dto.HourlyRate;

                    await _context.SaveChangesAsync();
                }
                var oldServices = _context.ProviderServices
                    .Where(x => x.ProviderProfileId == profile.Id);

                _context.ProviderServices.RemoveRange(oldServices);
                await _context.SaveChangesAsync();

                if (dto.ServiceIds != null && dto.ServiceIds.Any())
                {
                    foreach (var serviceId in dto.ServiceIds)
                    {
                        var exists = await _context.Services.AnyAsync(s => s.Id == serviceId);

                        if (!exists)
                            continue; 

                        _context.ProviderServices.Add(new ProviderService
                        {
                            ProviderProfileId = profile.Id,
                            ServiceId = serviceId
                        });
                    }

                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    message = "Profile saved successfully",
                    success = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        private int? GetUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("id")?.Value;

            return int.TryParse(id, out var userId) ? userId : null;
        }

    }
}
