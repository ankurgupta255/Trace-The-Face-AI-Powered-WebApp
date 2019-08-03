import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Footer from './components/Footer/footer.js';
import './App.css';
// import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';



const initinalState={
  input: '',
  imageurl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    // password: 'cookies',
    entries: 0,
    joined: ''
  }
}
class App extends Component{
  constructor(){
    super();
    this.state={
      input: '',
      imageurl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        // password: 'cookies',
        entries: 0,
        joined: ''
      }
    }
  }
  loadUser=(data)=>{
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000').then(response=>response.json()).then(data=>console.log(data));
  // }

  calculateFaceLocation= (data) =>{
    console.log(data.outputs[0].data.regions);
    var clarifaiFace= new Array(100);
    for(let i=0;i<data.outputs[0].data.regions.length;i++){
      clarifaiFace[i]=data.outputs[0].data.regions[i].region_info.bounding_box;
    }
    // const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    console.log(width, height);
    for(let i=0;i<clarifaiFace.length;i++){
      return{
      leftCol: clarifaiFace[i].left_col * width,
      topRow: clarifaiFace[i].top_row * height,
      rightCol: width- (clarifaiFace[i].right_col * width),
      bottomRow: height-(clarifaiFace[i].bottom_row * height),
    }
    }
    // return{
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width- (clarifaiFace.right_col * width),
    //   bottomRow: height-(clarifaiFace.bottom_row * height),
    // }
  }



  displayFaceBox=(box)=>{
    console.log(box);
    this.setState({box: box});
  }

  onInputChange= (event) =>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit=()=>{
    this.setState({imageurl: this.state.input});
    fetch('https://morning-hamlet-40775.herokuapp.com/imageurl',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
    }).then(response=>response.json())

    .then(response=>{
      if(response){
        fetch('https://morning-hamlet-40775.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
    }).then(response=>response.json())
        .then(count=>{
          this.setState(/*{user: {
            entries: count
          }}*/
          Object.assign(this.state.user,{entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err=>console.log(err));
  }
  onRouteChange=(route)=>{
    if(route=== 'signout'){
      this.setState(initinalState)
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render(){
    return (
    <div className="App">
    <Particles className='particles'
      params={{
        particles: {
          number: {
            value: 175,
            density: {
              enable: true,
              value_area: 800
            }
          }
          
        }
      }}
    />
      <Navigation isSignedIn ={this.state.isSignedIn}onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' ? <div> <Logo/>
       <Rank name={this.state.user.name} entries={this.state.user.entries}/>
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
       <FaceRecognition box={this.state.box}imageurl={this.state.imageurl}/> <Footer />
       </div> : (this.state.route === 'signin' ? <div><Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/><Footer /></div> : <div><Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/><Footer /></div>)
     }
    </div>
  );
  }
}

export default App;
