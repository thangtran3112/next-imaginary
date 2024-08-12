"use client";

import { dataUrl, getImageSize } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};
const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: CloudinaryUploadWidgetResults) => {
    try {
      const resultInfo = result?.info as CloudinaryUploadWidgetInfo;
      setImage((prevState: any) => ({
        ...prevState,
        publicId: resultInfo.public_id,
        width: resultInfo.width,
        height: resultInfo.height,
        secureURL: resultInfo.secure_url,
      }));

      //sync the new public_id and show the image
      onValueChange(resultInfo.public_id);

      toast({
        title: "Image uploaded successfully",
        description: "1 credit was deducted from your account",
        duration: 3000,
        className: "success-toast",
      });
    } catch (error) {
      //When result is not of type as CloudinaryUploadWidgetInfo
      toast({
        title: "Something went wrong while uploading",
        description: "Please try again",
        duration: 3000,
        className: "error-toast",
      });
    }
  };
  const onUploadErrorHandler = (error: CloudinaryUploadWidgetError) => {
    toast({
      title: "Something went wrong while uploading",
      description: "Please try again",
      duration: 3000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="next-imaginary"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>
          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="image"
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="media-uploader_cldImage"
                />
              </div>
            </>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
