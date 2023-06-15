import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
import checkLogin from "../../_lib/module/checkLogin";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- View
import View from "../../_view/random/index.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    const { auth, common } = store;

    auth.setCheckLogin(props);
    useEffect(() => {
        common.init();
    }, []);

    return (
        <>
            <View {...props} store={store} />
        </>
    );
});

//------------------------------------------------------------------------------- getServerSideProps
export async function getServerSideProps(context) {
    let datas = await checkLogin.default.ssr(context);
    return { props: datas };
}
//------------------------------------------------------------------------------- getServerSideProps

export default Home;
