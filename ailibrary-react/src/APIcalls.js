import axios from "axios";

// const url = "http://48.216.213.38/api"
const url = "http://localhost:5000/api";

export async function getCards() {
	try {
		const response = await axios.get(url + "/getFiles", {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error fetching cards:", error);
		return []
		// Handle errors here (e.g., return null or a default value)
	}
}

export function uploadFile(data) {
	// data is Array<File>
	const formData = new FormData();

	data.forEach((file) => {
		formData.append(file["name"], file); // Use an array field name
	});

	axios
		.post(url + "/uploadFile", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((response) => {
			console.log("File uploaded successfully!");
			// Handle successful upload (e.g., display a success message)
		})
		.catch((error) => {
			console.error("Upload failed:", error);
			alert("upload failed!\n" + error);
			// Handle upload failure (e.g., display an error message)
		});
}

export function deleteFile(id) {
	axios
		.delete(url + "/deleteFile/" + id, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((response) => {
			console.log("File deleted successfully!");
			// Handle successful upload (e.g., display a success message)
		})
		.catch((error) => {
			console.error("Deletion failed:", error);
			alert("Deletion failed!\n" + error);
		});
}

export async function downloadFile(name, fileId) {
	try {
		const response = await axios.get(url + "/downloadFile/" + fileId, {
			responseType: "blob" /* Specify response type as blob */,
		});

		const blob = response.data;
		const filename = name + ".wav";

		const link = document.createElement("a");
		if (window.navigator.webkitURL) {
			// WebKit/Blink browsers
			link.href = window.URL.createObjectURL(blob);
			link.download = filename;
			link.click();
		} else {
			// Firefox
			link.href = URL.createObjectURL(blob);
			link.download = filename;
			link.style.display = "none";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	} catch (error) {
		console.error("Error downloading file:", error);
		// Handle download errors (e.g., display an error message to the user)
	}
}
