package com.codeb.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeb.DTO.GroupRequest;
import com.codeb.entity.Group;
import com.codeb.service.GroupService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Group> addGroup(@RequestBody GroupRequest groupRequest) {
        Group group = new Group();
        group.setName(groupRequest.getName());
        return ResponseEntity.ok(groupService.addGroup(group));
    }

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SALES_PERSON')")
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups()); 
    }

    
    @PutMapping("/{groupId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Group> updateGroup(@PathVariable Long groupId, @RequestBody Map<String, String> request) {
        String newGroupName = request.get("newGroupName");
        return ResponseEntity.ok(groupService.updateGroup(groupId, newGroupName));
    }

    // Soft delete group (Only accessible to Admins)
    @DeleteMapping("/{groupId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.ok("Group deleted successfully");
    }
}