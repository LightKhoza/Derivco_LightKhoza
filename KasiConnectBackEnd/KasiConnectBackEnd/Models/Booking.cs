namespace KasiConnectBackEnd.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User Customer { get; set; }
        public int ProviderId { get; set; }
        public ProviderProfile Provider { get; set; }
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }
    }
}
