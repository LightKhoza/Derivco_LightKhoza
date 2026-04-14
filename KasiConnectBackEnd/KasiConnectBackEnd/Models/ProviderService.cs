namespace KasiConnectBackEnd.Models
{
    public class ProviderService
    {
        public int Id { get; set; }

        public int ProviderProfileId { get; set; }
        public ProviderProfile ProviderProfile { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; }

        public string CustomServiceName { get; set; }

        public decimal CustomRate { get; set; }
    }
}
