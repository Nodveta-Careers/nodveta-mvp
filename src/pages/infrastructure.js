import Head from "next/head";
import InfrastructurePlatform from "containers/infrastructure-platform";

const InfrastructurePage = () => {
  return (
    <>
      <Head>
        <title>Nodveta Technologies - Dependable Infrastructure for Onchain Applications</title>
        <meta
          name="description"
          content="Nodveta builds reliable transaction execution, real-time blockchain data, and developer tools for production applications. Connecting applications to blockchain with confidence."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <InfrastructurePlatform />
    </>
  );
};

export default InfrastructurePage;