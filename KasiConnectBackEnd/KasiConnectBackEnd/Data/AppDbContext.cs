using KasiConnectBackEnd.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace KasiConnectBackEnd.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        public DbSet<CustomerProfile> CustomerProfiles { get; set; }
        public DbSet<ProviderProfile> ProviderProfiles { get; set; }

        public DbSet<ProviderService> ProviderServices { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProviderService>()
                .HasKey(ps => new { ps.ProviderProfileId, ps.ServiceId });

            modelBuilder.Entity<ProviderService>()
                .HasOne(ps => ps.ProviderProfile)
                .WithMany(p => p.ProviderServices)
                .HasForeignKey(ps => ps.ProviderProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProviderService>()
                .HasOne(ps => ps.Service)
                .WithMany(s => s.ProviderServices)
                .HasForeignKey(ps => ps.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Service>().HasData(
                new Service { Id = 1, Name = "Plumbing" },
                new Service { Id = 2, Name = "Electrical" },
                new Service { Id = 3, Name = "Cleaning" },
                new Service { Id = 4, Name = "Painting" },
                new Service { Id = 5, Name = "Gardening" },
                new Service { Id = 6, Name = "Carpentry" },
                new Service { Id = 7, Name = "Make Up" },
                new Service { Id = 8, Name = "Appliance Repair" }
            );
        }
    }
}
