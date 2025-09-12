import React from 'react';



const Team = () => {


  const defaultTeamMembers = [
    { name: "Avi Garg", rollNum: "1024060263", avatar: "/teamImage/a.jpg" },
    { name: "Prashant Singh Negi", rollNum: "1024060107", avatar: "/teamImage/Prashant.jpg" },
    { name: "Samar Malik", rollNum: "1024060016", avatar: "/teamImage/samar.jpg" },
    { name: "Kashish Goyal", rollNum: "1024190032", avatar: "/teamImage/Kashishpic.jpg" },
    { name: "Ojasvin", rollNum: "ROLL NUM", avatar: "/teamImage/Ojasvin.jpg" },
    { name: "Ajitesh Thapliyal", rollNum: "1024190135", avatar: "/teamImage/ajitesh.jpeg" },
  ];

  const members = defaultTeamMembers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#548F77] pt-40 pb-20 text-white">
    
    
      
      <div className="container mx-auto px-4 text-center">
    
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-blue-400">Our</span>
          <span className="text-white"> Team</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-4xl mx-auto mb-16 leading-relaxed">
        We are a group of passionate learners and innovators, working together to turn ideas into 
          reality. Each member brings a unique set of skills, creativity, and dedication that 
          contribute to our collective success. From brainstorming solutions to executing projects, 
          our team thrives on collaboration, curiosity, and a shared vision for building impactful 
          solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
         
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-gray-200">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-400 text-lg">{member.rollNum}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;