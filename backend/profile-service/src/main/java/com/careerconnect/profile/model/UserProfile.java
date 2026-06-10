package com.careerconnect.profile.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Document(collection = "user_profiles")
public class UserProfile {
    
    @Id
    private String id;
    private String userId; // UUID from Auth service
    
    private String firstName;
    private String lastName;
    private String headline;
    private String currentJobStatus;
    private String studyLevel;
    private String phone;
    private String address;
    
    private List<Map<String, String>> education;
    private List<Map<String, String>> experience;
    private List<String> skills;
    
    private List<CvDocument> cvs = new ArrayList<>();
    private String profilePictureUrl;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getCurrentJobStatus() { return currentJobStatus; }
    public void setCurrentJobStatus(String currentJobStatus) { this.currentJobStatus = currentJobStatus; }

    public String getStudyLevel() { return studyLevel; }
    public void setStudyLevel(String studyLevel) { this.studyLevel = studyLevel; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<Map<String, String>> getEducation() { return education; }
    public void setEducation(List<Map<String, String>> education) { this.education = education; }

    public List<Map<String, String>> getExperience() { return experience; }
    public void setExperience(List<Map<String, String>> experience) { this.experience = experience; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<CvDocument> getCvs() { return cvs; }
    public void setCvs(List<CvDocument> cvs) { this.cvs = cvs; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
}
