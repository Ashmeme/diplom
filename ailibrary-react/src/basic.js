import { useDropzone } from "react-dropzone";
import React, { useMemo } from "react";
import { Button, Modal } from "rsuite";
import { uploadFile } from "./APIcalls";

const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#eeeeee",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
};

const focusedStyle = {
	borderColor: "#2196f3",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};

function Basic(props) {
	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept: {
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				[".docx"],
		},
		multiple: false,
	});

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));
	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isFocused, isDragAccept, isDragReject]
	);

	return (
		<div>
			<Modal.Body>
				<div className="container">
					<div {...getRootProps({ style })}>
						<input {...getInputProps()} />
						<p>Drop file here, or click to select file</p>
					</div>
					<aside>
						<h4>File</h4>
						<ul>{files}</ul>
					</aside>
				</div>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={async () => {
						props.prophandleClose();
						uploadFile(acceptedFiles);
						await props.propRefresh();
					}}
					appearance="primary"
				>
					Upload
				</Button>
			</Modal.Footer>
		</div>
	);
}

export default Basic;
