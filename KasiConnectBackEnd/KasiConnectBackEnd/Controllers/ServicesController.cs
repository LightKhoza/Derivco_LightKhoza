using KasiConnectBackEnd.Data;
using KasiConnectBackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KasiConnectBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            return Ok(await _context.Services.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> AddService(Service service)
        {
            var exists = await _context.Services
                .AnyAsync(s => s.Name == service.Name);

            if (exists)
                return BadRequest(new { message = "Service already exists" });

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }
    }
}
