using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> option) : base(option)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Ride> Rides { get; set; }
        public DbSet<VerificationRequest> VerificationRequests { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Ride>()
                 .Property(r => r.EstimatedPrice)
                 .HasColumnType("decimal(18,2)"); // 18 je ukupna preciznost, 2 je broj decimalnih mesta

            base.OnModelCreating(modelBuilder);
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
