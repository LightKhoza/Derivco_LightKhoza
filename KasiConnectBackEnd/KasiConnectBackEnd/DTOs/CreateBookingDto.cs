namespace KasiConnectBackEnd.DTOs
{
    public class CreateBookingDto
    {
        public int ProviderId { get; set; }
        public int ServiceId { get; set; }
        public DateTime DateTime { get; set; }
        public string Address { get; set; }
    }
}
