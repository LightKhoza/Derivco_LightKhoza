using KasiConnectBackEnd.Data;
using KasiConnectBackEnd.DTOs;
using KasiConnectBackEnd.Models;

namespace KasiConnectBackEnd.Services
{
    public class BookingService
    {
        private readonly AppDbContext _context;

        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> CreateBooking(int customerId, CreateBookingDto dto)
        {
            var booking = new Booking
            {
                CustomerId = customerId,
                ProviderId = dto.ProviderId,
                ServiceId = dto.ServiceId,
                DateTime = dto.DateTime,
                Address = dto.Address,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }
    }
}
