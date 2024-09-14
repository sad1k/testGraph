interface CircleProps{
  color: string;
  cx: number;
  cy: number
}

export const Circle = ({ color, cx, cy }: CircleProps) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="3"
      stroke={color}
      stroke-width="2"
      fill="#fff"
    ></circle>
  );
};
