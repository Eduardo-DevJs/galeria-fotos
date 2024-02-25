import { FormEvent, useEffect, useState } from "react";
import * as C from "./App.styles";
import * as Photos from "./services/photos";
import { Photo } from "./types/photo";
import { PhotoItem } from "./Components/PhotoItem";

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [UpLoading, setUpLoading] = useState<boolean>(false)

  useEffect(() => {
    async function getPhotos() {
      setLoading(true);

      let photos = await Photos.getAll();
      setPhotos(photos);

      setLoading(false);
    }

    getPhotos();
  }, []);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File;

    if(file && file.size > 0){
      setUpLoading(true)

      let result = await Photos.insert(file)

      setUpLoading(false)

      if(result instanceof Error){
        alert(`${result.name} - ${result.message}`)
      }else {
        let newPhotoList = [...photos]
        newPhotoList.push(result)
        setPhotos(newPhotoList)
      }
    }
  }

  return (
    <div>
      <C.Container>
        <C.Area>
          <C.Header>Galeria de fotos</C.Header>

          <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
            <input type="file" name="image" />
            <input type="submit" value="Enviar" />
            {UpLoading && "Enviando..."}
          </C.UploadForm>

          {loading && (
            <C.ScreenWarning>
              <div className="emoji">🤚</div>
              <div>Carragando</div>
            </C.ScreenWarning>
          )}

          {!loading && photos.length > 0 && (
            <C.PhotoList>
              {photos.map((item, index) => (
                <PhotoItem key={index} url={item.url} name={item.name} />
              ))}
            </C.PhotoList>
          )}

          {!loading && photos.length === 0 && (
            <C.ScreenWarning>
              <div className="emoji">😭</div>
              <div>Não há fotos cadastradas</div>
            </C.ScreenWarning>
          )}
        </C.Area>
      </C.Container>
    </div>
  );
}
