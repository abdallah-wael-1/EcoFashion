const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>Trust Score: {user.trustScore}</p>
      <button className="cursor-pointer">View Profile</button>
    </div>
  );
};

export default UserCard;