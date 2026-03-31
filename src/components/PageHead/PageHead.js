import Head from 'next/head';


export const PageHead = (props) => {
  const { children, title, hidePrefix } = props;

  const prefix = hidePrefix ? '' : 'HabiTools';
  const delimiterSymbol = (!hidePrefix && title) ? ' - ' : '';

  return (
    <Head>
      <title>{`${ prefix } ${ delimiterSymbol } ${ title || '' }`}</title>
      { children }
    </Head>
  );
};
