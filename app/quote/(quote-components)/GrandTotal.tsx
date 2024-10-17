type Props = {
  original: number;
  final: number;
  discount: number;
};

const GrandTotal = ({ original, final, discount }: Props) => {
  const discountChecker = discount > 0;
  return (
    <div className="flex gap-16">
      <h2>
        Grand <br /> Total
      </h2>
      <div className="text-center">
        <p>
          {discountChecker && (
            <b style={{ color: "gray", fontSize: 12 }}>
              <s> RM {original}</s>
            </b>
          )}
          <br />
          <b style={{ fontSize: 20 }}>RM {final}</b>
          <br />
          {discountChecker && (
            <b style={{ color: "#009BFF", fontSize: 12 }}>Save RM {discount}</b>
          )}
        </p>
      </div>
    </div>
  );
};

export default GrandTotal;
