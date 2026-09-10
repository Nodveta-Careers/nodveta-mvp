export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/infrastructure",
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
