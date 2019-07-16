import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/ylogo.png';

class Difference extends Component {

    
   render() {
        return (
            <div className="container">
                <label>Before:</label>
                <br />
                <textarea id="textareaBefore" cols="80" rows="10">
                This is not a test.
                This is line 2.
                </textarea>
            
                
                
                <label>After:</label>
                <br />
                <textarea id="textareaAfter" cols="80" rows="10">
                This is totally a test.
                This is line 2.
                </textarea>
                
                
                <button id="buttonCompare" onclick="buttonCompareClicked();">Compare</button>
                
                
                <label>Differences:</label>
                <br />
                <div id="textareaDifferences" style="border:1px solid;height:200px"></div>
            </div>
                
            )
    }
}

export default Difference;

