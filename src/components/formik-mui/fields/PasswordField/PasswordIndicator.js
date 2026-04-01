import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const Indicator = styled('div')`
  ${ p => (p.bgColor ? (
    `background-color: ${ p.theme.palette[p.bgColor]?.main };`
  ) : '') }
  border-radius: 3px;
  color: ${ p => (p.color
    ? p.theme.palette[p.color]?.main
    : p.theme.palette.text.white
  ) };
  padding: 0 0.8em;
`;


const passwordRank = (password) => {
  const minLength = 8;
  let score = 0;

  const positiveRegexes = {
    lower: /[a-z]/,
    upper: /[A-Z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/,
    tenChars: /^.{10,}$/,
    twelveChars: /^.{12,}$/,
    sixteenChars: /^.{16,}$/,
    twentyChars: /^.{20,}$/,
    twentyFiveChars: /^.{25,}$/,
    thirtyChars: /^.{30,}$/,
  };
  const negativeRegexes = {
    threeConsecutively: /(.)\1\1/,
    common1: /qwe/,
    common2: /rty/,
    common3: /123/,
    common4: /456/,
    common5: /!@#/,
    common6: /\$%\^/,
    common7: /pass/,
    common8: /word/,
    common9: /abc/,
  };

  if (!password || password.length < minLength) { return 'TOO_SHORT'; }

  Object.values(positiveRegexes).forEach((regex) => {
    if (regex.test(password)) { score++; }
  });
  Object.values(negativeRegexes).forEach((regex) => {
    if (regex.test(password)) { score--; }
  });

  return score;
};


export const PasswordIndicator = (props) => {
  const [ score, setScore ] = useState(0);

  useEffect(() => {
    setScore(passwordRank(props.password));
  }, [ props.password ]);

  if (score === 'TOO_SHORT') {
    return props.hideTooShort ? (
      <Indicator bgColor="rgba(0, 0, 0, 0)" color="rgba(0, 0, 0, 0)">&#8205;</Indicator>
    ) : (
      <Indicator bgColor="rgba(0, 0, 0, 0.08)" color="rgba(0, 0, 0, 0.5)">Must be at least 8 characters</Indicator>
    );
  }

  if (score >= 10) {
    return <Indicator bgColor={ 'success' }>VERY Strong Password</Indicator>;
  }

  if (score >= 8) {
    return <Indicator bgColor={ 'success' }>Very Strong Password</Indicator>;
  }

  if (score >= 6) {
    return <Indicator bgColor={ 'success' }>Strong Password</Indicator>;
  }

  if (score >= 4) {
    return <Indicator bgColor={ 'warning' }>Weak Password</Indicator>;
  }

  return <Indicator bgColor={ 'error' }>Very Weak Password</Indicator>;
};
