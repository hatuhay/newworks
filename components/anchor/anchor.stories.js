export default {
  title: "Components/Anchor Target",
  parameters: {
    docs: {
      description: {
        component: "anchor target"
      }
    }
  }
};

// Twig file.
import anchorTemplate from './anchor.twig';

// CSS file.
import './anchor.css';

// Yml file.
import anchorData from './anchor.component.yml';

export const anchor = () => {
  return anchorTemplate({
    ...anchorData.props.properties
  })
}
