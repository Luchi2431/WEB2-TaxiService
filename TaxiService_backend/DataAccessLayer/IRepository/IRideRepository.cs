using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.IRepository
{
    public interface IRideRepository
    {
        Ride AddRide(RideDTO newRide);

        RideDTO UpdateRide(Ride ride);

        List<RideDTO> GetRidesByUserId(int id);

        List<RideDTO> GetAllRides();

        Task<Ride> FindRideByIdAsync(int rideId);

        Task<List<Ride>> FindNewRidesAsync();
    }


}
