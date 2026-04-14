namespace KasiConnectBackEnd.Models
{
    public class Provider
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; }
        public decimal HourlyRate { get; set; }
        public string Location { get; set; }

        public User User { get; set; }
    }
}
