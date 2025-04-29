// utils/withAuth.js
export function withAuth(getServerSidePropsFunc) {
    return async (context) => {
      const { req } = context;
      const token = req.cookies.accessToken;
    console.log("token", token);
    
      if (!token) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
  
      // If there's a custom getServerSideProps, call it
      if (getServerSidePropsFunc) {
        return await getServerSidePropsFunc(context);
      }
  
      return {
        props: {},
      };
    };
  }