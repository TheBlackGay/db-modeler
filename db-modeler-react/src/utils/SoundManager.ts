class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private isMuted: boolean = false;

  private constructor() {
    // 初始化音效
    this.sounds = {
      click: new Audio('/sounds/click.mp3'),
      success: new Audio('/sounds/success.mp3'),
      error: new Audio('/sounds/error.mp3'),
      hover: new Audio('/sounds/hover.mp3'),
      notification: new Audio('/sounds/notification.mp3'),
      complete: new Audio('/sounds/complete.mp3'),
      pop: new Audio('/sounds/pop.mp3'),
    };

    // 预加载所有音效
    Object.values(this.sounds).forEach(audio => {
      audio.load();
      audio.volume = 0.5;
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(soundName: string): void {
    if (this.isMuted || !this.sounds[soundName]) return;

    // 克隆音频元素以支持重叠播放
    const sound = this.sounds[soundName].cloneNode() as HTMLAudioElement;
    sound.volume = this.sounds[soundName].volume;
    sound.play().catch(error => console.error('播放音效失败:', error));
  }

  public setVolume(volume: number): void {
    Object.values(this.sounds).forEach(audio => {
      audio.volume = Math.max(0, Math.min(1, volume));
    });
  }

  public mute(): void {
    this.isMuted = true;
  }

  public unmute(): void {
    this.isMuted = false;
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export const soundManager = SoundManager.getInstance();

// 添加音效钩子
export const useSound = () => {
  return {
    playClick: () => soundManager.play('click'),
    playSuccess: () => soundManager.play('success'),
    playError: () => soundManager.play('error'),
    playHover: () => soundManager.play('hover'),
    playNotification: () => soundManager.play('notification'),
    playComplete: () => soundManager.play('complete'),
    playPop: () => soundManager.play('pop'),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    toggleMute: () => soundManager.toggleMute(),
    isMuted: () => soundManager.isSoundMuted(),
  };
}; 