import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent as NgxImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxImageCropperComponent]
})
export class ImageCropperComponent implements OnInit, OnChanges {
  @Input() imageFile: File | null = null;
  @Input() imageBase64: string | null = null;
  @Output() imageCropped = new EventEmitter<{ file: File; base64: string }>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(NgxImageCropperComponent) imageCropper!: NgxImageCropperComponent;

  croppedImage: string = '';
  showCropper = false;
  fileToCrop: File | undefined = undefined;
  base64ToCrop: string | undefined = undefined;
  isProcessing = false;

  constructor(private cdr: ChangeDetectorRef) {}
  
  // Transform controls
  transform: ImageTransform = {};
  scale = 1;
  rotation = 0;
  flipHorizontal = false;
  flipVertical = false;

  ngOnInit(): void {
    this.loadImage();
    this.setupWhiteBackgroundRemover();
  }

  private setupWhiteBackgroundRemover(): void {
    // Watch for any dynamically added elements with white backgrounds
    const observer = new MutationObserver(() => {
      this.removeWhiteBackgrounds();
    });

    // Start observing when cropper is shown
    setTimeout(() => {
      const cropperElement = document.querySelector('image-cropper');
      if (cropperElement) {
        observer.observe(cropperElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      }
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageFile'] || changes['imageBase64']) {
      this.loadImage();
    }
  }

  private loadImage(): void {
    if (this.imageFile) {
      this.fileToCrop = this.imageFile;
      this.base64ToCrop = undefined;
      this.showCropper = true;
      // Remove white backgrounds after a short delay
      setTimeout(() => this.removeWhiteBackgrounds(), 300);
    } else if (this.imageBase64) {
      this.base64ToCrop = this.imageBase64;
      this.fileToCrop = undefined;
      this.showCropper = true;
      // Remove white backgrounds after a short delay
      setTimeout(() => this.removeWhiteBackgrounds(), 300);
    }
  }

  imageCroppedEvent(event: ImageCroppedEvent): void {
    console.log('Image cropped event received:', event);
    if (event) {
      // ngx-image-cropper v8 provides blob, not base64 directly
      if (event.blob) {
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            this.croppedImage = result;
            this.isProcessing = false;
            this.cdr.detectChanges(); // Force change detection
            console.log('Cropped image set from blob, length:', this.croppedImage.length);
          } else {
            console.error('FileReader result is empty');
            this.isProcessing = false;
          }
        };
        reader.onerror = () => {
          console.error('Error reading blob');
          this.isProcessing = false;
        };
        reader.readAsDataURL(event.blob);
      } else if ((event as any).base64) {
        // Fallback for base64 if available
        this.croppedImage = (event as any).base64;
        this.isProcessing = false;
        this.cdr.detectChanges();
        console.log('Cropped image set from base64, length:', this.croppedImage.length);
      } else if (event.objectUrl) {
        // Try using objectUrl as fallback
        console.log('Using objectUrl as fallback');
        this.croppedImage = event.objectUrl;
        this.isProcessing = false;
        this.cdr.detectChanges();
      } else {
        console.warn('Image cropped event missing blob or base64:', event);
        this.isProcessing = false;
      }
    }
  }

  imageLoaded(): void {
    // Image loaded, wait a bit then trigger crop
    setTimeout(() => {
      if (this.imageCropper) {
        this.imageCropper.crop();
        this.removeWhiteBackgrounds();
      }
    }, 150);
  }

  cropperReady(): void {
    // Cropper is ready, trigger initial crop
    setTimeout(() => {
      if (this.imageCropper) {
        this.imageCropper.crop();
        this.removeWhiteBackgrounds();
      }
    }, 250);
  }

  private removeWhiteBackgrounds(): void {
    // Force remove white backgrounds from all elements
    const cropperElement = document.querySelector('image-cropper');
    if (cropperElement) {
      const allElements = cropperElement.querySelectorAll('*');
      allElements.forEach((el: any) => {
        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const bg = style.background;
        
        // Check for white backgrounds in various formats
        if (bgColor === 'rgb(255, 255, 255)' || 
            bgColor === 'rgba(255, 255, 255, 1)' ||
            bgColor === '#ffffff' ||
            bgColor === '#fff' ||
            bg === 'white' ||
            bg.includes('255, 255, 255') ||
            bg.includes('#fff')) {
          (el as HTMLElement).style.setProperty('background-color', 'var(--bg-overlay)', 'important');
          (el as HTMLElement).style.setProperty('background', 'var(--bg-overlay)', 'important');
        }
      });
      
      // Force dark background on all canvas elements
      const canvases = cropperElement.querySelectorAll('canvas');
      canvases.forEach((canvas: HTMLCanvasElement) => {
        canvas.style.setProperty('background-color', 'var(--bg-overlay)', 'important');
        canvas.style.setProperty('background', 'var(--bg-overlay)', 'important');
      });
      
      // Force dark background on all divs
      const divs = cropperElement.querySelectorAll('div');
      divs.forEach((div: HTMLDivElement) => {
        const style = window.getComputedStyle(div);
        if (style.backgroundColor === 'rgb(255, 255, 255)' || 
            style.backgroundColor === 'rgba(255, 255, 255, 1)') {
          div.style.setProperty('background-color', 'var(--bg-overlay)', 'important');
        }
      });
    }
  }

  // Zoom controls
  zoomOut(): void {
    this.scale -= 0.1;
    this.applyTransform();
  }

  zoomIn(): void {
    this.scale += 0.1;
    this.applyTransform();
  }

  // Rotation controls
  rotateLeft(): void {
    this.rotation -= 90;
    this.applyTransform();
  }

  rotateRight(): void {
    this.rotation += 90;
    this.applyTransform();
  }

  // Flip controls
  flipH(): void {
    this.flipHorizontal = !this.flipHorizontal;
    this.applyTransform();
  }

  flipV(): void {
    this.flipVertical = !this.flipVertical;
    this.applyTransform();
  }

  // Reset transform
  resetTransform(): void {
    this.scale = 1;
    this.rotation = 0;
    this.flipHorizontal = false;
    this.flipVertical = false;
    this.applyTransform();
  }

  private applyTransform(): void {
    this.transform = {
      scale: this.scale,
      rotate: this.rotation,
      flipH: this.flipHorizontal,
      flipV: this.flipVertical
    };
  }

  onCrop(): void {
    console.log('onCrop called, isProcessing:', this.isProcessing, 'hasCroppedImage:', !!this.croppedImage);
    
    if (this.isProcessing) {
      return; // Prevent multiple clicks
    }

    // If we already have a cropped image, use it immediately
    if (this.croppedImage) {
      console.log('Using existing cropped image');
      const file = this.base64ToFile(this.croppedImage, 'profile-picture.jpg');
      setTimeout(() => {
        this.imageCropped.emit({ file, base64: this.croppedImage });
      }, 0);
      return;
    }

    // Otherwise, trigger a crop and wait for the event
    if (this.imageCropper) {
      console.log('Triggering crop...');
      this.isProcessing = true;
      
      // Force crop
      this.imageCropper.crop();
      
      // Wait for the imageCroppedEvent to fire and blob to be converted to base64
      // Use a polling approach with timeout (blob conversion is async)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait (blob conversion can take time)
      const checkInterval = setInterval(() => {
        attempts++;
        if (this.croppedImage) {
          console.log('Cropped image available after', attempts, 'attempts');
          clearInterval(checkInterval);
          this.isProcessing = false;
          const file = this.base64ToFile(this.croppedImage, 'profile-picture.jpg');
          console.log('Emitting cropped image event, file size:', file.size, 'base64 length:', this.croppedImage.length);
          // Use setTimeout to ensure change detection runs
          setTimeout(() => {
            this.imageCropped.emit({ file, base64: this.croppedImage });
          }, 0);
        } else if (attempts >= maxAttempts) {
          console.warn('Crop did not complete in time after', attempts, 'attempts');
          clearInterval(checkInterval);
          this.isProcessing = false;
          // Try one more crop
          if (this.imageCropper) {
            this.imageCropper.crop();
            setTimeout(() => {
              if (this.croppedImage) {
                const file = this.base64ToFile(this.croppedImage, 'profile-picture.jpg');
                this.imageCropped.emit({ file, base64: this.croppedImage });
              } else {
                console.error('Failed to get cropped image after retry');
              }
            }, 1000);
          }
        }
      }, 100);
    } else {
      console.error('Image cropper component not available');
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}

