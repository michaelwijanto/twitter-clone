const LoadingRing = ({ size = "md" }) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-ring ${sizeClass} text-info`} />;
};
export default LoadingRing;
