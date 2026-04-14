namespace KasiConnectBackEnd.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<ProviderService> ProviderServices { get; set; } = new();
    }
}
