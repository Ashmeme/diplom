import React, { useState, useEffect } from "react";
import "./files.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiDownloadLine } from "react-icons/ri";
import { Modal, Button } from "rsuite";
import Basic from "./basic";

import { deleteFile, downloadFile, getCards } from "./APIcalls";

function Files() {
	const [cards, setcards] = useState([]);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);


	const fetchData = async () => {
		try {
			const entries = await getCards();
			let data = [];
			setcards(data);
			try {
				entries.forEach((entry) => {
					entry = JSON.parse(entry);
					data.push({
						id: entry._id.$oid,
						filename: entry.name,
						status: entry.status,
					});
				});
			} catch (error) {}
			setcards(data);
		} catch (error) {
			console.error("couldnt get cards");
		}
	};
	useEffect(() => {
        fetchData();

        const eventSource = new EventSource('http://48.216.213.38/events');
        eventSource.addEventListener('update', () => {
            fetchData();
        });

        return () => {
            eventSource.close();
        };
    }, []);
	return (
		<div>
			<div class="text-search-bar">
				<p class="text-content">Files</p>

				<div class="search-and-buttons">
					<div class="buttons" style={{ width: "100px" }}>
						<Button onClick={handleOpen}>Select file...</Button>
						<Modal open={open} onClose={handleClose}>
							<Modal.Header>
								<Modal.Title>Select File</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Basic prophandleClose={handleClose} propRefresh={fetchData} />
							</Modal.Body>
						</Modal>
						{/* </Uploader> */}
					</div>
				</div>
				{cards.length === 0 ? (
					<div className="box NoFiles">
						<span>No files have been uploaded yet.</span>
					</div>
				) : (
					<div className="box WithFiles">
						{cards.map((card) => (
							<div className="card">
								<div class="title-and-buttons">
									<span className="title">{card.filename}</span>
									{card.status === "Ready" ? (
										<>
											<FaRegTrashAlt
												className="button"
												onClick={() => {
													deleteFile(card.id);
													fetchData();
												}}
											/>
											<RiDownloadLine
												className="buttons"
												onClick={() => downloadFile(card.filename, card.id)}
											/>
										</>
									) : card.status === "Failed" ? (
										<FaRegTrashAlt
											className="button"
											onClick={ () => {
												deleteFile(card.id);
												fetchData();
											}}
										/>
									) : null}
								</div>
								<div class="status-and-line">
									<p class="status">Status: {card.status}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Files;
