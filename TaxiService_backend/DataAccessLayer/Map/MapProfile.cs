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
            
            CreateMap<Ride, RideDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();      
            CreateMap<User, ProfileDTO>().ForMember(x => x.Token, opt => opt.Ignore()).ForMember(x => x.UserType, opt => opt.Ignore()).ForMember(x => x.ProfilePicture, opt => opt.Ignore()).ReverseMap();
        }
    }
}
