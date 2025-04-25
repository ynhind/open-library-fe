import victor from "../../assets/victor.png";
import "./TitleTypeTwo.css";

export default function TitleTypeTwo({ ClassName, Title }) {
  return (
    <div className={`titleTypeTwo ${ClassName}`}>
      <h2>{Title}</h2>

      <img src={victor} alt="" className="victor" />
    </div>
  );
}
