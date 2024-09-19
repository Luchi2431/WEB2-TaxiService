using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class EmailStrukture
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Fromwho { get; set; }
        public string Hostname { get; set; }
        public int Port { get; set; }
        public string ApiKey { get; set; }
    }
}
