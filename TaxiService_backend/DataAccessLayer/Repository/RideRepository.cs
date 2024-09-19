using AutoMapper;
using DataAccessLayer.Context;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repository
{
    public class RideRepository : IRideRepository
    {
        private ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public RideRepository(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Ride AddRide(RideDTO newRide)
        {
            Ride ride = _mapper.Map<Ride>(newRide);
            _db.Rides.Add(ride);
            _db.SaveChanges();

            return _mapper.Map<Ride>(ride); //Dobra je praksa vratiti kreirani objekat nazad,
                                            //narocito ako se auto generise ID
        }


        public RideDTO UpdateRide(Ride ride)
        {
            //User user = _mapper.Map<User>(newUser);
            _db.Rides.Update(ride);
            _db.SaveChanges();

            return _mapper.Map<RideDTO>(ride); //Dobra je praksa vratiti kreirani objekat nazad,
                                               //narocito ako se auto generise ID
        }

       

        public List<RideDTO> GetRidesByUserId(int id)
        {
            return _db.Rides.Where(r => r.UserId == id)
                .Select(r => new RideDTO
                {
                    Id = r.Id,
                    StartAddress = r.StartAddress,
                    EndAddress = r.EndAddress,
                    EstimatedPrice = r.EstimatedPrice,
                    EstimatedTime = r.EstimatedTime
                })
                .ToList();
        }

        public List<RideDTO> GetAllRides()
        {
            var newRides = _db.Rides // Pretpostavljam da imaš neki status za nove vožnje
                .Select(r => new RideDTO
                {
                    Id = r.Id,
                    StartAddress = r.StartAddress,
                    EndAddress = r.EndAddress,
                    EstimatedPrice = r.EstimatedPrice,
                    EstimatedTime = r.EstimatedTime
                })
                .ToList();

            return newRides;
        }



    }
}
