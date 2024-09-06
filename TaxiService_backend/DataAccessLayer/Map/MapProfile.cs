using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccessLayer.DTO;
using DataAccessLayer.Models;

namespace DataAccessLayer.Map
{
    public class MapProfile: Profile
    {
        public MapProfile()
        {
            CreateMap<Notification, NotificationDTO>().ReverseMap();
            CreateMap<Ride, RideDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<VerificationRequest, VerificationRequestDTO>().ReverseMap();
        }
    }
}
