import "../MainCodes_Cssfiles/Footer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faEye, faDollarSign } from '@fortawesome/free-solid-svg-icons'; // Use appropriate icons
export default function Footer() {
    return (
        <div className="footer-class">
            <div className="shares">
                <FontAwesomeIcon icon={faShare} size="2x" style={{ color: 'rgba(1, 185, 243, 0.30)' }} />
                <p>MORE SHARES</p>
            </div>
            <div className="traking">
                <FontAwesomeIcon icon={faEye} size="2x" style={{ color: 'rgba(1, 185, 243, 0.30)' }} />
                <p>TRKING SHARES</p>
            </div>
            <div className="free">
                <FontAwesomeIcon icon={faDollarSign} size="2x" style={{ color: 'rgba(1, 185, 243, 0.30)' }} />
                <p>FOR FREE</p>
            </div>
        </div>
    );
}
