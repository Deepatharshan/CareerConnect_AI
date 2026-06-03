package com.careerconnect.profile.model;

public class CvDocument {
    private String id;
    private String name;
    private String url;
    private String uploadedAt;

    public CvDocument() {
    }

    public CvDocument(String id, String name, String url, String uploadedAt) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }
}
