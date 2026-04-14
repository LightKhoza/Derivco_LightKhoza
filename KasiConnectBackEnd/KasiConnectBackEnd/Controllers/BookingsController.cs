using KasiConnectBackEnd.Data;
using KasiConnectBackEnd.DTOs;
using KasiConnectBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KasiConnectBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // CUSTOMER: Create booking
        // =========================
        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var booking = new Booking
            {
                CustomerId = userId,
                ProviderId = dto.ProviderId,
                ServiceId = dto.ServiceId,
                DateTime = dto.DateTime,
                Address = dto.Address,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        // =========================
        // CUSTOMER OR PROVIDER VIEW
        // =========================
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> MyBookings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            var query = _context.Bookings.AsQueryable();

            if (role == "Customer")
                query = query.Where(b => b.CustomerId == userId);

            else if (role == "Provider")
                query = query.Where(b => b.ProviderId == userId);

            else
                return Forbid();

            var result = await query
                .Include(b => b.Service)
                .Include(b => b.Provider)
                    .ThenInclude(p => p.User)
                .Select(b => new
                {
                    id = b.Id,
                    serviceName = b.Service.Name,
                    providerName = b.Provider.User.Name,
                    customerName = b.Customer.Name,
                    dateTime = b.DateTime,
                    status = b.Status,
                    address = b.Address
                })
                .ToListAsync();

            return Ok(result);
        }

        // =========================
        // PROVIDER: Update status
        // =========================
        [Authorize(Roles = "Provider")]
        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusDto dto)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
                return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (booking.ProviderId != userId)
                return Forbid();

            booking.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> BookingHistory()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var role = User.FindFirst(ClaimTypes.Role).Value;

            IQueryable<Booking> query;

            if (role == "Customer")
            {
                query = _context.Bookings.Where(b =>
                    b.CustomerId == userId &&
                    (b.Status == "Completed" || b.Status == "Rejected"));
            }
            else if (role == "Provider")
            {
                query = _context.Bookings.Where(b =>
                    b.ProviderId == userId &&
                    (b.Status == "Completed" || b.Status == "Rejected"));
            }
            else
            {
                return Unauthorized();
            }

            var history = await query
                .OrderByDescending(b => b.DateTime)
                .ToListAsync();

            return Ok(history);
        }
    }
}