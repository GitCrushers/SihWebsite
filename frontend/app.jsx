import React from 'react';

interface TeamMember {
  name: string;
  rollNum: string;
  avatar: string;
}

interface Props {
  teamMembers?: TeamMember[];
}

const TeamPage = (props: Props) => {
  const { teamMembers } = props;

  const defaultTeamMembers: TeamMember[] = [
    { name: "NAME", rollNum: "ROLL NUM", image: "" },
    { name: "NAME", rollNum: "ROLL NUM", avatar: "" },
    { name: "NAME", rollNum: "ROLL NUM", avatar: "" },
    { name: "NAME", rollNum: "ROLL NUM", avatar: "" },
    { name: "NAME", rollNum: "ROLL NUM", avatar: "" },
    { name: "NAME", rollNum: "ROLL NUM", avatar: "" },
  ];

  const members = teamMembers || defaultTeamMembers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-green-900 text-white">
      {/* Navigation hehehehehhhhhhhhhhh*/ }
      <div className="flex justify-center pt-8 pb-16">
        <nav className="border border-gray-600 rounded-full px-8 py-3">
          <div className="flex items-center space-x-12">
            <a href="#" className="tbg-gradient-to-r from-blue-400 to-white transition-colors">Home</a>
            <a href="#" className="bg-gradient-to-r from-blue-400 to-white transition-colors">About</a>
            <span className="text-white font-bold">LOGO</span>
            <a href="#" className="bg-gradient-to-r from-blue-400 to-white transition-colors">Dashboard</a>
            <a href="#" className="bg-gradient-to-r from-blue-400 to-white transition-colors">Team</a>
          </div>
        </nav>
      </div>

      {/* Main Content  aluuuuuuuuuuuu*/}
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-blue-400">Our</span>
          <span className="text-white"> Team</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg max-w-4xl mx-auto mb-16 leading-relaxed">
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
        </p>

        {/* Teamwa yooooooooooooooooo  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Avatar */}
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-gray-200">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Member Info  yeeeee our team will fun ffffffffffff*/}
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

export default TeamPage;