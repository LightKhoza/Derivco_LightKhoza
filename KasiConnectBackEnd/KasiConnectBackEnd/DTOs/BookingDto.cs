namespace KasiConnectBackEnd.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public string ServiceName { get; set; }
        public string ProviderName { get; set; }
        public string CustomerName { get; set; }

        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }
    }
}
