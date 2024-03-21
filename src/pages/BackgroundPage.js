import backgroundImage from '../assets/journey-line.3d24e208.png';
import '../PagesCSS/Background.css';

 

function Background() {
    return (
      <div className="background">
        <div className='background-image-wrapper'>
          <img className="background-image" src={backgroundImage} alt="Background" />
        </div>
      </div>
    );
  }
  
  export default Background;