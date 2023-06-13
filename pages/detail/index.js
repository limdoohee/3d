import React from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- View
import View from "../../_view/detail/index.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    return (
        <>
            <View {...props} store={store} />
        </>
    );
});

export default Home;