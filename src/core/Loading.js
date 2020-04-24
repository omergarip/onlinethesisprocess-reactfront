import React, { Component } from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";
import * as legoData from "./legoloading.json";
import * as doneData from "./doneloading.json";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: legoData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};
const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: doneData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

class Loading extends Component {
    render() {
        const { done } = this.props
        return (
            <div>
                <FadeIn>
                    <div id='loading-component' className="d-flex justify-content-center align-items-center">
                        <h1>fetching data</h1>
                        {!done ?
                            <Lottie options={defaultOptions} height={120} width={120} />
                            :
                            <Lottie options={defaultOptions2} height={120} width={120} />
                        }


                    </div>
                </FadeIn>

            </div>
        );
    }
}

export default Loading;