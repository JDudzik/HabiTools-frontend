import { styled } from '@mui/material/styles';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';


const AccordionStyle = styled(Accordion)`
  box-shadow: none !important;
  margin: 0 !important;

  :before {
    display: none;
  }
`;

const AccordionSummaryStyle = styled(AccordionSummary)`
  display: none !important;
`;

const AccordionDetailsStyle = styled(AccordionDetails)`
  display: block !important;
  padding: 8px 0 0 2em !important;
`;



export const HiddenAccordion = (props) => {
  const { children, summaryProps, detailProps, ...remainingProps } = props;

  return (
    <AccordionStyle { ...remainingProps }>
      <AccordionSummaryStyle { ...summaryProps } />
      <AccordionDetailsStyle { ...detailProps }>
        {children}
      </AccordionDetailsStyle>
    </AccordionStyle>
  );
};
