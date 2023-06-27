import React from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
import checkLogin from "../../_lib/module/checkLogin";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- View
import View from "../../_view/setting/alarm.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    const { common, auth } = store;

    // 로그인 정보 스토어에 담는 함수
    auth.setCheckLogin(props);
    // 로그인 처리 분기
    // 로그인 토큰이 있는 경우에만 접근 가능: "loginOnly"
    // 로그인 토큰이 있을경우 보내는 페이지가 있는 경우 : okUrl 사용
    checkLogin.loginResultCheck({ store: store, rule: "loginOnly", result: props });
    // 화면 출력
    return <>{common.pageInit && <View props={props} store={store} />}</>;
});

//------------------------------------------------------------------------------- getServerSideProps
export async function getServerSideProps(context) {
    let datas = await checkLogin.default.ssr(context);
    return { props: datas };
}
//------------------------------------------------------------------------------- getServerSideProps

export default Home;
