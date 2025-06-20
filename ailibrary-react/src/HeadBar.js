import "./HeadBar.css";
import Logo from "./media/logo.png";
function HeadBar() {
	return (
		<div>
			<div class="header-bar">
				<img src={Logo} alt="Logo" class="logo" />
				<span class="header-text">AI Library</span>
				<div class="buttons"></div>
			</div>
		</div>
	);
}

export default HeadBar;
