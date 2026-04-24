const SwapCard = ({ swap }) => {
  return (
    <div className="swap-card">
      <h3>Swap Request</h3>
      <p>Offering: {swap.offering}</p>
      <p>Requesting: {swap.requesting}</p>
      <button className="cursor-pointer">Accept</button>
      <button className="cursor-pointer">Decline</button>
    </div>
  );
};

export default SwapCard;