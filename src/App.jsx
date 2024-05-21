import { useState, useEffect, useRef } from "react";
import Container from "./components/Container/Container";
import SearchBar from "./components/SearchBar/SearchBar";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import LoadMoreButton from "./components/LoadMoreButton/LoadMoreButton";
import ImageModal from "./components/ImageModal/ImageModal";
import getImages from "./api";
import handleLoadMoreScroll from "./scroll";

export default function App() {
  const [images, setImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const galleryItemRef = useRef();

  function openModal(modalData) {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    setModalData(modalData);
  }

  function closeModal() {
    setIsOpen(false);
    document.body.style.overflow = "visible";
  }

  useEffect(() => {
    async function handleSearch() {
      try {
        if (currentQuery !== "") {
          setIsLoading(true);
          setError(false);
          const imageData = await getImages(currentQuery, currentPage);
          if (!imageData.results.length) {
            setIsEmpty(true);
            return;
          }
          if (currentPage === 1) {
            setTotalPages(imageData.total_pages);
          }
          setImages((prevImages) => [...prevImages, ...imageData.results]);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    handleSearch();
  }, [currentQuery, currentPage]);

  useEffect(() => {
    if (currentPage === 1) return;
    handleLoadMoreScroll(galleryItemRef.current);
  }, [images, currentPage]);

  function handleSubmit(query) {
    setIsEmpty(false);
    setCurrentQuery(query);
    setCurrentPage(1);
    setImages([]);
  }

  function handleLoadMoreBtnClick() {
    setCurrentPage(currentPage + 1);
  }

  return (
    <div>
      <SearchBar onSubmit={handleSubmit} />
      <main>
        <Container notHeader>
          {!images.length && !isLoading && !isEmpty && (
            <p>Let's get started!</p>
          )}
          {isEmpty && <p> Sorry, no images found!</p>}
          {images.length > 0 && (
            <ImageGallery
              ref={galleryItemRef}
              images={images}
              onOpenModal={openModal}
            />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage />}
          {images.length > 0 && !isLoading && currentPage !== totalPages && (
            <LoadMoreButton onClick={handleLoadMoreBtnClick} />
          )}
          {modalIsOpen && (
            <ImageModal
              onCloseModal={closeModal}
              modalIsOpen={modalIsOpen}
              modalData={modalData}
            />
          )}
        </Container>
      </main>
    </div>
  );
}