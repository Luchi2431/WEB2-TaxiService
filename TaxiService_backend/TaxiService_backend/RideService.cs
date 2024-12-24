using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaxiService_backend
{
    public class RideService : IRideService
    {
        private readonly IRideRepository _rideRepository;

        public RideService(IRideRepository rideRepository)
        {
            _rideRepository = rideRepository;
        }

        public async Task<RideDTO> EstimateRideAsync(string startAddress, string endAddress)
        {
            // Random vrednosti za cenu i vreme čekanja vozača
            Random random = new Random();
            decimal estimatedPrice = random.Next(500, 2000); // Primer: cena između 500 i 2000 dinara
            TimeSpan estimatedTime = TimeSpan.FromSeconds(random.Next(5, 20)); // Primer: vreme između 5 i 20 minuta

            // Kreiranje DTO objekta za procenu vožnje
            var rideEstimate = new RideDTO
            {
                StartAddress = startAddress,
                EndAddress = endAddress,
                EstimatedPrice = estimatedPrice,
                EstimatedTime = estimatedTime,
                RideStatus = RideStatus.Created // Status čeka na potvrdu korisnika
            };



            return rideEstimate; // Vraća procenu korisniku
        }



        public async Task<Ride> ConfirmRideAsync(RideDTO rideDto)
        {

            return _rideRepository.AddRide(rideDto);
        }


        public async Task<List<RideDTO>> GetNewRidesAsync()
        {

            var newRides = await _rideRepository.FindNewRidesAsync();

            return newRides.Select(r => new RideDTO
            {
                Id = r.Id,
                StartAddress = r.StartAddress,
                EndAddress = r.EndAddress,
                EstimatedPrice = r.EstimatedPrice,
                EstimatedTime = r.EstimatedTime
            }).ToList();
        }


        public async Task<RideDTO> AcceptRideAsync(int rideId, int driverId)
        {
            Random random = new Random();
            TimeSpan EstimatedArrivalTime = TimeSpan.FromSeconds(random.Next(5, 20));


            var ride = await _rideRepository.FindRideByIdAsync(rideId);
            if (ride == null || ride.DriverId != 0)
            {
                return null; // Vožnja nije pronađena ili je već prihvaćena
            }

            // Prihvati vožnju (dodeli vozaču)
            ride.DriverId = driverId;
            ride.RideStatus = RideStatus.InProgress; // Pretpostavljam da imaš status za prihvaćene vožnje
            ride.EstimatedArrivalTime = EstimatedArrivalTime;

            return _rideRepository.UpdateRide(ride);
        }




        public async Task<List<RideDTO>> GetPreviousRidesAsync(int id)
        {
            // Pronađi nove vožnje koje su dostupne za vozače
            return _rideRepository.GetRidesByUserId(id);
        }

        public async Task<List<RideDTO>> GetMyRidesAsync(int id)
        {
            // Pronađi nove vožnje koje su dostupne za vozače
            return _rideRepository.GetRidesByUserId(id);
        }




        public async Task<List<RideDTO>> GetAllRidesAsync()
        {
            // Pronađi nove vožnje koje su dostupne za vozače
            return _rideRepository.GetAllRides();
        }

    }
}
